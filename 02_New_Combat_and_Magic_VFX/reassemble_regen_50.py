import hashlib, glob

parts = sorted(glob.glob("Kai_Capybara_GO_REGEN_50_Assets.zip.part*"))
assert len(parts) == 11, f"Expected 11 parts, found {len(parts)}"
with open("Kai_Capybara_GO_REGEN_50_Assets.zip", "wb") as out:
    for p in parts:
        out.write(open(p, "rb").read())

sha = hashlib.sha256(open("Kai_Capybara_GO_REGEN_50_Assets.zip", "rb").read()).hexdigest()
assert sha == "b4a19078f64d02f2b40d8cb96b463e49da978440f872dbc1ff1efc51d005c09b", f"SHA mismatch: {sha}"
print("Reassembled Kai_Capybara_GO_REGEN_50_Assets.zip OK! SHA-256:", sha)
