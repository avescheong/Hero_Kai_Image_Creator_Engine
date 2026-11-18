import pathlib
parts = sorted(pathlib.Path(".").glob("Kai_Capybara_GO_KAI_FACE_HAIR_REGEN_55.zip.part*"))
out = pathlib.Path("Kai_Capybara_GO_KAI_FACE_HAIR_REGEN_55.zip")
with out.open("wb") as f:
    for p in parts:
        f.write(p.read_bytes())
print(f"Reassembled {out} ({out.stat().st_size} bytes) from {len(parts)} parts.")
