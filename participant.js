import {firebaseConfig} from './firebase-config.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,signInAnonymously,signInWithCustomToken} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFunctions,httpsCallable} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
const GOOGLE_FORM_URL='https://docs.google.com/forms/d/e/1FAIpQLSdbEeLUeETT4LYPlfSlfgYE_Rqyxdh3VUl8joyt8kG_v-K74A/viewform';
const GOOGLE_ID_ENTRY='entry.1162340557';
const app=initializeApp(firebaseConfig),auth=getAuth(app),fn=getFunctions(app,'europe-west2');
const $=id=>document.getElementById(id),status=$('status'),questionnaire=$('questionnaire-link'),questionnaireContainer=$('questionnaire-container'),check=$('check-submission'),waiting=$('waiting-for-form'),available=$('recording-available');let pollTimer=null;
async function checkStatus(announce=true){try{if(announce)status.textContent='Checking whether your questionnaire has been received…';
const r=await httpsCallable(fn,'checkQuestionnaireStatus')({});
if(r.data.readyToRecord){

questionnaireContainer.hidden=true;
questionnaireContainer.innerHTML='';

waiting.hidden=true;

available.hidden=false;
    status.textContent='Your questionnaire and consent confirmation have been received.';
    if(pollTimer)clearInterval(pollTimer);
    pollTimer=null;
    return true}if(announce)status.textContent='We have not yet received the completed questionnaire and consent confirmation. If you have just submitted it, wait a few moments and try again.'}catch(e){console.error(e);
if(announce)status.textContent='We could not check the questionnaire submission. Please try again.'}return false} async function init(){try{status.textContent='Preparing your secure study session…';
await signInAnonymously(auth);
const r=await httpsCallable(fn,'createParticipantSession')({});
await signInWithCustomToken(auth,r.data.customToken);
sessionStorage.setItem('lungsightSessionId',r.data.sessionId);
const u=new URL(GOOGLE_FORM_URL);
u.searchParams.set('usp','pp_url');
u.searchParams.set(GOOGLE_ID_ENTRY,r.data.participantId);
questionnaire.href=u.toString();questionnaire.setAttribute('aria-disabled','false');
check.disabled=false;
status.textContent='Your study session is ready. Complete the questionnaire and consent form to continue.';
pollTimer=setInterval(()=>checkStatus(false),5000);setTimeout(()=>{if(pollTimer){clearInterval(pollTimer);
    pollTimer=null}},900000)}catch(e){console.error(e);status.textContent='The study session could not be created. Please reload the page.'}}questionnaire.onclick=e=>{

e.preventDefault();

if(questionnaire.getAttribute('aria-disabled')==='true')return;

questionnaireContainer.hidden=false;

questionnaireContainer.innerHTML='<iframe src="'+questionnaire.href+'" title="LungSight questionnaire and consent" style="width:100%;height:800px;border:0;"></iframe>';

questionnaire.style.display='none';

};
check.onclick=()=>checkStatus(true);init();
