#!/usr/bin/env python3
import hashlib, json
from pathlib import Path

here = Path(__file__).resolve().parent
manifest = json.loads((here / "Kai_Capybara_GO_v2_0_Modular.manifest.json").read_text())
buf = bytearray()
for p in manifest["parts"]:
    chunk = (here / p["part"]).read_bytes()
    assert hashlib.sha256(chunk).hexdigest() == p["sha256"], f"SHA-256 mismatch on {p['part']}"
    buf.extend(chunk)
assert hashlib.sha256(buf).hexdigest() == manifest["sha256"], "Full archive SHA-256 mismatch"
out = here / manifest["filename"]
out.write_bytes(buf)
print(f"Reassembled {out} ({len(buf)} bytes, SHA-256 verified)")
