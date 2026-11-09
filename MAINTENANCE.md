# Medical Robotics site handover

Open [the station editor](admin/) to edit station titles, topics, introductions, explanations, model descriptions and reflection questions in English and German for stations 1–4. Preview each language and follow the publication instructions in the editor. The student site reads station-content.json. Drafts are private to the browser profile, not synced between colleagues. Anyone can try the form, but publishing requires GitHub repository access.

## Ownership and publication

Before handover, the repository owner should grant the professor or a designated maintainer write access and verify that person can open and merge a test pull request. Keep a second maintainer. For long-term institutional ownership consider transferring to a university GitHub organization and updating Pages URLs and the editor’s GitHub link if the repository moves. No credentials belong in the site files.

Create a branch, review the pull request diff, then merge to main. Check the Pages deployment in Actions and open the changed station. To roll back text, revert the merged pull request and merge the revert. Repository administrators may require reviews via branch protection where available.

## Changes outside the text editor

Videos and subtitle tracks are stored under assets; inspect the source and track elements in index.html for their current paths. Replacing a video also requires checking its German audio and retiming both caption tracks. The catheter and biopsy model animation is in board-guide.js. Other interactions, standalone stations, new stations and navigation changes are code changes: create a branch and review them before merging. A branch alone does not create a hosted preview of those code changes.
