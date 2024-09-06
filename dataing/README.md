# Data-ing, the process of making data
all means to make proper data will be coded in here.

## Get started
you will need:
- a typescript compiler, I use `tsc`.
- `node`JS, I use the version 22
- a node package manager, I use `npm`
```
npm install
npm run build
// this will likely put an error on the build
```
the configuration file is personnal, thus not included. Rename `config_template.ts` to `config.ts`, to be able to build.
if more error shows up, then it's possible I have not updated the template (oupsie xd)
```
npm run run
// this will likely tells you it cannot find "path to your pokeemerald folder".
// you need to yourself configure it right
```

You can override the config with command line arguments, to get a better understanding do
```
npm run run -- -h
```
# More in details

## Three steps:
This whole process include, 
1. Taking informations automatically from the game files. (parser)
2. Addings/Removing/Changing data from a file written by a human. (patcher)
3. Prepare every big pack of data send directly to the client to be the most lightweight and reliable possible on the networking. (Packer)

## Parser

## Patcher
- [ ] Adding
- [ ] Removing
- [ ] Changing
- [ ] Rules

## Packers
- [ ] Message pack

## TODO
[ ] Create a partial C parser
    - [x] endline processing & whitespace normalization
    - [x] comment filtering
    - [x] C preprocessing parsing
    - [x] C preprocessing replacement
    - [ ] Enum handling
    - [ ] Declaration handling
[ ] Build an automatic data aggregator from the base game I intend to support (here it's pokemon Elite redux) that outputs data in a basic json state.
[ ] Create a data patcher
    - [ ] Build a system to manually check/adding/removing/modifying data extending from precise datas to broad rules.
[ ] Create a data packer for efficient transmissions data
    - [ ] Build a compaction system to set most informations as implicit in order to reduce the data size.
    - [ ] Pack the data with messagepack and name it correctly to be used by the UI.
    - [ ] Build Comparative data to allow users to compare versions.
[x] Create a CLI argument processing
[ ] Add creation date for UI to know when to udate
[ ] Creating a version.json for the UI to know what other branch there is
