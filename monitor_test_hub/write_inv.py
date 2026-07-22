import os
src = "/Users/divyyadav/.gemini/antigravity/brain/d7ecbf4f-017a-43a4-99c4-d9847cffc1c9/site_inventory.md"
dst = "/Users/divyyadav/.gemini/antigravity/brain/821b54ce-7442-4de3-9415-0f9da1118256/site_inventory.md"
os.makedirs(os.path.dirname(dst), exist_ok=True)
with open(src, "r") as f: data = f.read()
with open(dst, "w") as f: f.write(data)
print("DONE")
