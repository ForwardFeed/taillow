# Synchronizer
Managee the project

## Why?
Here's the multiple challenge I face, when updating the data, 
- I need to know which algorithm to use to parse
- Sometimes I want to know if i'm a version superior of X
- Which version I am working on
- Which constants to load in the calc
- Which version to make a comparify with.
- Having a nice documentation on how to use all tools

## Hence The project needs to be synchronized.
Which is why i intend to have tools to help me and my future me to handle the project

## Datalink
Why is this step needed?
Lets imagine two versions
```
export enum species{
    Bulbasaur = 0
} 
```
and the second version
```
export enum species{
    Bulbasaur = 0 + 1,
    NewSpecie = 1456
} 
```
The devs of the game decided to increment all internals IDS by 1 because they can.
However the calc only have one code base, and when compiled it's static because it's assembly.
I could compare strings but I will not because if something gets renamed it's the same problem AND it's really bad for performances.
I could do that manually but no, I will not.
I cannot just bring the data I need because one code base and if I do the reference of the NewSpecie in the code I will not compile as I cannot do C preprocessing directives in assembly script.
So even if I import the version 1 I'll still refer to data that are defined only in the version 2 in the codebase.
So If version one is imported it must look like that 
```
export enum species{
    Bulbasaur = 0,
    NewSpecie = 1456
} 
```

## TODO
[ ] Create a version manager
[ ] Create a cli interactive application
[ ] Generate a datalink between the calc and ui
[ ] Generate a list of all version to be shared to the client, with the latest updated and compare files
[ ] Merge constants into a constant.ts for the calc