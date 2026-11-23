# LungSight - GitHub Pages front end + Firebase backend

This package is arranged so the participant-facing static files can be uploaded directly to the root of a GitHub repository and served by GitHub Pages.

## GitHub Pages files
`index.html`, `participant.html`, `recording.html`, CSS, JS, `images/`, and the test PIS are all at repository root and use relative URLs, so a project URL such as `https://ACCOUNT.github.io/REPOSITORY/` works correctly.

## Backend remains Firebase
GitHub Pages is static hosting. The files in `functions/`, `firestore.rules`, and `storage.rules` must still be deployed to the LungSight Firebase project. Do not expect GitHub Pages to run Cloud Functions.

## Required setup
1. Replace the placeholder values in `firebase-config.js` with the LungSight Firebase Web App configuration.
2. In Firebase Authentication, enable Anonymous Authentication.
3. Deploy `functions/`, `firestore.rules`, and `storage.rules` to Firebase. The included `firebase-backend.json` is the Firebase deployment configuration; when deploying, rename/copy it to `firebase.json` in a separate backend working folder so it is not confused with GitHub Pages hosting.
4. Set `GOOGLE_FORM_WEBHOOK_SECRET` in Firebase Functions.
5. Add `google-apps-script.gs` to the Google Form Apps Script project and create an installable On form submit trigger.
6. Set Apps Script properties `LUNGSIGHT_WEBHOOK_URL` and `LUNGSIGHT_WEBHOOK_SECRET`.
7. In Firebase Authentication settings > Authorized domains, add the exact GitHub Pages host, for example `ACCOUNT.github.io`. Firebase Auth must authorize the host used by the Pages site.
8. In Google Cloud/Firebase API restrictions and App Check settings, allow/configure the GitHub Pages deployment as appropriate for PPIE testing.

## Current Google Form integration
- Form response URL: `https://docs.google.com/forms/d/e/1FAIpQLSdbEeLUeETT4LYPlfSlfgYE_Rqyxdh3VUl8joyt8kG_v-K74A/viewform`
- Study-reference entry: `entry.1162340557`
- Consent question: `Do you consent to take part in the Lungsight study?`
- Affirmative checkbox value: `Yes`
- Page 2 polls every 5 seconds for up to 15 minutes.

## Publish
Upload the contents of this folder to a GitHub repository, then use repository Settings > Pages > Deploy from a branch > `main` > `/ (root)`.

## Research-data warning
GitHub Pages is being used only to serve the static participant interface. Real participant questionnaire status and video storage remain in Firebase/Google services. Complete institutional information-governance, ethics and security review before using the system with real health research data.
