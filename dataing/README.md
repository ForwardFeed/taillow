# Data-ing, the process of making data
all means to make proper data will be coded in here.

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
[ ] Create a C parser
    - [ ] endline processing & whitespace normalization
    - [ ] comment filtering
    - [ ] C preprocessing parsing
    - [ ] C preprocessing replacement
    - [ ] Enum handling
    - [ ] Declaration handling
[ ] Build an automatic data aggregator from the base game I intend to support (here it's pokemon Elite redux) that outputs data in a basic json state.
[ ] Create a data patcher
    - [ ] Build a system to manually check/adding/removing/modifying data extending from precise datas to broad rules.
[ ] Create a data packer for efficient transmissions data
    - [ ] Build a compaction system to set most informations as implicit in order to reduce the data size.
    - [ ] Pack the data with messagepack and name it correctly to be used by the UI.
    - [ ] Build Comparative data to allow users to compare versions.
[ ] Create a CLI argument processing
[ ] Add creation date
