# app/core/sse_manager.py
import asyncio, json
from collections import defaultdict
from typing import Any, Dict

class SSEManager:
    def __init__(self):
        self._subs: Dict[str, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, user_id: str) -> asyncio.Queue:
        q = asyncio.Queue()
        self._subs[user_id].append(q)
        return q

    def unsubscribe(self, user_id: str, q: asyncio.Queue):
        self._subs[user_id].remove(q)
        if not self._subs[user_id]:
            del self._subs[user_id]

    async def publish(self, user_id: str, event: Dict[str, Any]):
        data = json.dumps(event)
        for q in list(self._subs.get(user_id, [])):
            q.put_nowait(data)

sse_manager = SSEManager()
