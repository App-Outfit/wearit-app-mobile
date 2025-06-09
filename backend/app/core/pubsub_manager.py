import asyncio, json
from collections import defaultdict
from typing import Any, Dict
from app.core.logging_config import logger

class PubSubManager:
    def __init__(self):
        self._subs: Dict[str, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, user_id: str) -> asyncio.Queue:
        q = asyncio.Queue()
        self._subs[user_id].append(q)
        logger.info(f"PUBSUB: user '{user_id}' subscribed ({len(self._subs[user_id])})")
        return q

    def unsubscribe(self, user_id: str, q: asyncio.Queue):
        self._subs[user_id].remove(q)
        remaining = len(self._subs.get(user_id, []))
        logger.info(f"PUBSUB: user '{user_id}' unsubscribed ({remaining} left)")
        if not remaining:
            del self._subs[user_id]

    async def publish(self, user_id: str, event: Dict[str, Any]):
        data = json.dumps(event)
        queues = list(self._subs.get(user_id, []))
        logger.info(f"PUBSUB: publishing to '{user_id}' ({len(queues)} subs)")
        for q in queues:
            q.put_nowait(data)

pubsub_manager = PubSubManager()
