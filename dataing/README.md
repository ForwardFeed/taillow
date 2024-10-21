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

## 4 steps:
This whole chained process include, 
1. Taking informations automatically from the game files into a data structure often as series of C tokens. (extractor)
2. Taking the raw C tokens and build some datastructure that interrest us. (grabber)
3. Preparing the big data (often redondant) and indexing it so it takes less memory space on the client, optionnally verifying that the data is right. (packer)
4. preparing the data into files (JSON or GZIP) and dispatch the data automatically in the whole project, so the UI or the calc don't have to pull the data. as well as constructing some data to be more easily exploitable. (exporter)


# Partial Todo list

## Extractor
- [ ] Create a partial C parser
    - [x] endline processing & whitespace normalization
    - [x] comment filtering
    - [x] C preprocessing parsing
    - [x] C preprocessing replacement
    - [ ] Enum handling
    - [ ] Declaration handling
    - [ ] Improving the C object to JS object thing (currently it's meh)
    - [ ] Make a poryscript parser to extract valuable information without errors
## Patcher
- [x] Adding
- [x] Removing
- [x] Changing
- [ ] Rules or
- [ ] Something akin to content management system
## Packers
- [x] indexing
- [ ] verifying

## Exporter
- [x] support JSON
- [x] support GZIP
- [x] build version.json for the UI
- [x] move files to the U
