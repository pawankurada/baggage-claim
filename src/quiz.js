export function validateQuiz(quiz){
 if(!quiz?.question||quiz.options?.length!==4||quiz.options.filter(option=>option.correct===true).length!==1)throw new Error('Each bag quiz needs a question, four options and exactly one correct answer.');
}

export function showBagQuiz(document,overlay,quiz,onClaim,schedule=setTimeout,sounds={}){
 validateQuiz(quiz);
 const make=(tag,value,className)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
 const card=make('div','','card quiz-card');card.role='dialog';card.ariaModal='true';card.ariaLabel=quiz.question;
 const answers=make('div','','quiz-answers'),feedback=make('div','','quiz-feedback');feedback.role='status';feedback.ariaLive='polite';
 const claim=make('button',quiz.buttonText||'Claim the Bag 👜','quiz-claim');claim.hidden=true;
 let solved=false,claimed=false,revealed=false;
 const buttons=quiz.options.map(option=>{
  const button=make('button',option.text,'quiz-option');button.type='button';
  if(option.text.includes('~~')){
   button.textContent='';
   option.text.split(/(~~.*?~~)/g).forEach(part=>button.append(make(part.startsWith('~~')?'s':'span',part.startsWith('~~')?part.slice(2,-2):part)));
  }
  button.onclick=()=>{
   if(solved)return;
   buttons.forEach(item=>item.className='quiz-option');
   if(!option.correct){sounds.answerWrong?.();button.className='quiz-option quiz-wrong';feedback.className='quiz-feedback';feedback.textContent=option.feedback||'Try again ❤️';return;}
   solved=true;buttons.forEach(item=>item.disabled=true);
   const reveal=()=>{
    if(overlay.children[0]!==card)return;
    revealed=true;sounds.answerCorrect?.();button.className='quiz-option quiz-correct';
    feedback.className='quiz-feedback quiz-success';feedback.textContent=[option.feedback,quiz.successMessage].filter(Boolean).join(' ');
    claim.hidden=false;claim.focus();
   };
   if(option.teaseFeedback){sounds.answerWrong?.();button.className='quiz-option quiz-wrong';feedback.className='quiz-feedback';feedback.textContent=option.teaseFeedback;schedule(reveal,option.revealDelayMs??1400);}else reveal();
  };
  answers.append(button);return button;
 });
 claim.onclick=()=>{if(!revealed||claimed)return;claimed=true;onClaim();};
 card.append(make('div','👜 No Answer, No Bag','eyebrow'),make('h1',quiz.question),answers,feedback,claim);
 overlay.replaceChildren(card);buttons[0].focus();
 return {card,buttons,feedback,claim};
}

