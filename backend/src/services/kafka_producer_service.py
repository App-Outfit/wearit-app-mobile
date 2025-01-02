import logging
from aiokafka import AIOKafkaProducer
from confluent_kafka.admin import AdminClient, NewTopic
from src.config.settings import get_kafka_client

logger = logging.getLogger(__name__)

class KafkaServiceProducer:
    """ 
    Kafka service class for managing Kafka operations.
    """
    def __init__(self):
        kafka_config = get_kafka_client()
        self.boostrap_servers = kafka_config["bootstrap_servers"]
        self.auto_offset_reset = kafka_config["auto.offset.reset"]
        self.auto_commit_enable = kafka_config["auto.commit.enable"]
        self.producer = None
        self.admin_client = AdminClient({"bootstrap.servers": self.boostrap_servers})

    async def start(self):
        """
        Start the Kafka producer.
        """
        self.producer = AIOKafkaProducer(
            bootstrap_servers=self.boostrap_servers,
            enable_auto_commit=self.auto_commit_enable,
            auto_offset_reset=self.auto_offset_reset
        )
        await self.producer.start()
        logger.info("Kafka producer started")

    async def stop(self):
        """
        Stop the Kafka producer.
        """
        if self.producer:
            await self.producer.stop()
            logger.info("Kafka producer stopped")
            self.producer = None
        
    async def create_topic(self, topic_name, num_paritions=1, replication_factor=1):
        """
        Create a new Kafka topic.
        """
        new_topic = NewTopic(topic_name, num_partitions=num_paritions, replication_factor=replication_factor)
        topic_list = [new_topic]
        futures = self.admin_client.create_topics(topic_list)
        for topic, future in futures.items():
            try:
                future.result()
                logger.info(f"Topic {topic} created")
            except Exception as e:
                logger.error(f"Failed to create topic {topic}: {e}")

    async def delete_topic(self, topic_name):
        """
        Delete a Kafka topic.
        """
        futures = self.admin_client.delete_topics([topic_name])
        for topic, future in futures.items():
            try:
                future.result()
                logger.info(f"Topic {topic} deleted")
            except Exception as e:
                logger.error(f"Failed to delete topic {topic}: {e}")

    async def send_message(self, topic_name, key, value):
        """
        Send a message to a Kafka topic.
        """
        if not self.producer:
            await self.start()

        try:
            key = key.encode('utf-8') if isinstance(key, str) else key
            value = value.encode('utf-8') if isinstance(value, str) else value

            await self.producer.send_and_wait(topic_name, key=key, value=value)
            logger.info(f"Message sent to topic {topic_name}")
        except Exception as e:
            logger.error(f"Failed to send message to topic {topic_name}: {e}")
            raise e