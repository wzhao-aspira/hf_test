# CA Project 

## How to use Realm DB
- DB schema should put in src/db/models folder
- Don't write db function in one whole file, split it by function, eg: ProfileDetail.ts, ProfileSummary.ts
- Export/Import db function to src/db/index.ts
- Only import db function from src/db/index.ts when use it in other pages, eg: service or screen.

---