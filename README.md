# TaillowPapers, Let me look that up.
TaillowPapers is my biggest planned project.

# Why?
Because having multiple codebase was tiring me. Doing compatibility between each tool was frail and prone to change
The dex was done in haste and its foundation weren't build for long term maintainability but rather short term emergency.
The smogon calc is a 11 years old project that is victim of terrible technical debts that prevents a lot of improvement, it wasn't built for multiversionning, multilanguage.
Some others project have been started but none has caught my attention.

# What are the objectives
## 1 Data Aggregator
- Build an automatic data aggregator from the base game I intend to primarily support (here it's pokemon Elite redux) that outputs data in a basic json state.
- Build a system to manually check/adding/removing/modifying data extending from precise datas to broad rules.
- Build a compaction system to set most informations as implicit in order to reduce the data size.
- Pack the data with messagepack and name it correctly.
## 2 Dex
[ ] Build using modern tools (Vue3) an application
[ ] Bundle it using vite.

# How to use?
The structure of the project is a bit labyrinthic but there's 4 subproject

## Dataing
This project is to craft data meant to be used by the ui & the calculator

## synchronizer
This is meant to take data out of the datating subproject and put them into their right place, and updating the right data
to keep the project synchronized. When the UI is loaded with a set of data, the calculator is compiled with the same set of data.
Also the calc needs to have constants of all version at least declared.

Asynchonicity could cause vicious bugs, the only solution to that would be include the calc into the UI but that's no-no.

## project_tui
I just did that for the fun, it's an UI in the terminal (you can even click on buttons) which may work only for linux.
I needed to work on vue, so this was a good training ground.