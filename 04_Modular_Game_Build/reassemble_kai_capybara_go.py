#!/usr/bin/env python3
import json
import hashlib
from pathlib import Path

manifest = json.loads(Path("kai_capybara_go_v1_0_chunks_manifest.json").read_text(encoding="utf-8"))
out_file = Path(manifest["archive"])
buf = bytearray()
for p in manifest["parts"]:
    chunk = Path(p["filename"]).read_bytes()
    assert hashlib.sha256(chunk).hexdigest() == p["sha256"], f"Checksum mismatch on {p['filename']}"
    buf.extend(chunk)
assert hashlib.sha256(buf).hexdigest() == manifest["sha256"], "Final archive SHA-256 mismatch!"
out_file.write_bytes(buf)
print(f"Reassembled {out_file} ({len(buf)} bytes) — SHA-256 VERIFIED!")
