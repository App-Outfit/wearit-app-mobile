import logging
from aiokafka import AIOKafkaConsumer
from src.config.settings import get_kafka_client

logger = logging.getLogger(__name__)

class KafkaServiceConsumer:
    """ 
    Kafka service class for managing Kafka operations.
    """
    def __init__(self, topics, group_id):
        kafka_config = get_kafka_client()
        self.boostrap_servers = kafka_config["bootstrap_servers"]
        self.auto_offset_reset = kafka_config["auto.offset.reset"]
        self.auto_commit_enable = kafka_config["auto.commit.enable"]
        self.consumer = None
        self.topics = topics
        self.group_id = group_id

    async def start(self):
        """
        Start the Kafka consumer.
        """
        self.consumer = AIOKafkaConsumer(
            *self.topics,
            bootstrap_servers=self.boostrap_servers,
            enable_auto_commit=self.auto_commit_enable,
            auto_offset_reset=self.auto_offset_reset,
            group_id=self.group_id
        )
        await self.consumer.start()
        logger.info("Kafka consumer started")

    async def stop(self):
        """
        Stop the Kafka consumer.
        """
        if self.consumer:
            await self.consumer.stop()
            logger.info("Kafka consumer stopped")
            self.consumer = None