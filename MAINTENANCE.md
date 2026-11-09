# Maintaining the student site

Open the student site and select Administration in the footer (or append ?manage=1 before the station hash). Sign in with a fine-grained GitHub personal access token restricted to this repository, with Contents read and write permission. Generate it under GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens. Each maintainer needs their own account with repository write access. Never share a token or paste it into a station text. Sign out on shared computers. The token and unpublished changes are held only in browser memory.

Open one of the first four stations. Click outlined text to edit it, switch between English and German, or choose an MP4 up to 25 MB beside the station video. Videos are shared between languages. Check the existing subtitle timing for a replacement video. Preview and then Publish. GitHub authorizes the write and Pages deploys it. Branch rules requiring a pull request prevent direct publication. Concurrent changes are rejected. To undo a publication, revert its commit in GitHub.

Games, new stations, subtitle files and animations are maintained in the repository. Before handover, test publishing with the professor’s own account and confirm their ability to recover or revert a change.
