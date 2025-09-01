let title=document.querySelector('.main-header')
let progress=document.querySelector('.progress')
let result=document.querySelector('.progress-result')
let question=document.querySelector('.question .que')
let answers=document.querySelector('.question .ansewers')
let back=document.querySelector('.back')
let skip=document.querySelector('.skip')
let prog=document.querySelector('span.prog')
let explain=document.querySelector('.explain')
let time=document.querySelector('.time')
let select=document.querySelector('select')

let allQ=0,currentQ=0,questionResult=[],percent=0,follow=0,numberCh=0,click=0
result.innerHTML=`${percent}% complete`
let finished=false,correctIndexes=[],incorrectIndexes=[],solotion=[],studentAnswers=[]
let finishTime=false, timeSet=0,end=false,haveExplination=true,link='javascript'
let messgeTime= `
        <div class='message'><span class='red'>The Time is Over Wait</span> <br>For See Your Result</div>
        <span></span>
        `
let normalMessge= `
        <div class='message'>The Test is Over Wait <br>For See Your Result</div>
        <span></span>
        `      
let field={
    'javascript':"/json/java_script.json",
    'data-analysis':"/json/data_analysis.json",
    'culture':"/json/culture_public.json",
    'math':"/json/math_questions.json",
    'psychology':"/json/psychology_question.json",
}
let progSet=setInterval(()=>{
    prog.style.width=(100*follow)/allQ+'%';
    
},100)
let mointor=setInterval(()=>{
    if(finishTime && !end){
            clearInterval(mointor)
            finished=false
            if(currentQ<allQ)
            {
                let mada=allQ-currentQ
                for(let i=0;i<mada;i++){
                    currentQ++;
                    setQuestion(currentQ)
                }
                follow=currentQ
            }
            skip.classList.add('green')
            setpercent()
            getResult(messgeTime)
            finished=false
            skip.innerHTML==='See your Answer'
            prog.style.width='100%'
        }
},1000)
function timeFun(){
    let numberTime=(allQ+1)*20
    let minutes=Math.floor(numberTime/60)
    let sec=numberTime%60
    time.innerHTML=''
    timeSet=setInterval(()=>{  
    minutes=minutes<10&&Array.from(minutes.toString()).length<2?minutes+'0':minutes
    sec=sec<10&&Array.from(sec.toString()).length<2?sec+'0':sec
    time.innerHTML=minutes+":"+sec
    sec--;
    if(sec<0){
        sec=59;
        minutes--;
    }
    },1000) 
    setTimeout(()=>{
        clearInterval(timeSet)
        finishTime=true;
    },numberTime*1000+1000)
}


function setValues(result){
    title.innerHTML=Object.keys(result)
    result=result[Object.keys(result)]
    allQ=result.length-1
    clearInterval(timeSet)
    timeFun()
    answers.innerHTML=''
    questionResult=[];
    questionResult.push(...result)
    setQuestion(currentQ)
}
function toggleNone(char){
    if(finished && !studentAnswers[follow]){
        explain.innerHTML=questionResult[follow].answer
    }else
        explain.innerHTML=''

    if(char==='+'){
        question.innerHTML=questionResult[follow].question
        let children=Array.from(answers.children),ind=0
        //this loop will detect the first li is visailble
        for(let j=0;j<children.length;j++){
            if(!children[j].classList.contains('none')){
                ind=j;
                break;
            }
        }
        for(let i=0;i<numberCh;i++){
            children[ind++].classList.add('none')
        }
         for(let i=0;i<numberCh;i++){
            children[ind++].classList.remove('none')
        }
    }
    else if(char==='-'){
        question.innerHTML=questionResult[follow].question
        let children=Array.from(answers.children),ind=0
        //this loop will detect the first li is visailble
        for(let j=0;j<children.length;j++){
            if(!children[j].classList.contains('none')){
                ind=j;
                break
            }
        }
        let odd_ind=ind-1
        for(let i=0;i<numberCh;i++){
            children[ind++].classList.add('none')
        }
        for(let i=0;i<numberCh;i++){
            children[odd_ind--].classList.remove('none')
        }
    }else if(answers.classList.contains('block')){
        question.innerHTML=questionResult[follow].question
        for(let i=follow;i<numberCh;i++){
            answers.children[i].classList.remove('none')
        }
    }
    else{
        Array.from(answers.children).forEach((ele)=>{
            ele.classList.add('none')
        })
    }
}
function setpercent(){
    click=0
    Array.from(answers.children).filter((e)=>{
        if(e.classList.contains('click'))
            click++
        return e
    })
    percent=Math.floor((100*click)/(allQ+1));
    result.innerHTML=`${percent}% complete`
}
function setQuestion(num){
        question.innerHTML=questionResult[num].question
        numberCh=questionResult[num].choices.length
        toggleNone()
        for(let i=0;i<numberCh;i++){
            let li=document.createElement('li')
            li.innerHTML=questionResult[num].choices[i]
            answers.appendChild(li)
        }

}
window.onload=()=>{
    fetchFun()
}
select.addEventListener('click',(e)=>{
    link=e.target.value.trim()
    if(!end)
        fetchFun()
})
function fetchFun(){
    fetch(field[link]).then((result)=> result.json())
    .then((result)=>{
        setValues(result)
    })
}
function getSolotion(){
    let solotion=[]
    for(let i=0;i<=allQ;i++){
        let answer=questionResult[i].answer
        for(let j=0;j<numberCh;j++){
            if(questionResult[i].choices[j]===answer){
                solotion.push([i,j])
            }
        }
    }
    return solotion
}
function proccesAnswers(){
    let indexes=[],find=false
    let k=0
    for(let i=0;i<=allQ;i++){
        for(let j=0;j<numberCh;j++){
            let e=answers.children[k++]

            if(e.classList.contains('click'))
            {
                let ans=[i,j]  
                indexes.push(ans)
                find=true
            }
        }
        if(!find)
             { indexes.push([])
                find=false
             }
    }
    return indexes
}
function addBlock(){
    Array.from(answers.children).forEach((e)=>{
        e.classList.add('block')
    })
    answers.classList.add('block')
}
function seeAnswer(){
    let count=document.querySelector('.count')
    count.remove()
    finished=true;
    follow=0;
    addBlock();
    toggleNone();
}
function showResult(count,pass){
    let evulation={
        '100':'Awesome',
        '90':'Very Good',
        '80':'Good',
        '70':'good',
        '60':'Middle',
        '50':'Middle',
        '40':'Bad',
        '30':'Bad',
        '20':'Bad',
        '10':'Bad',
        '0':'So Bad',
        '00':'So Bad',
    }
    explain.innerHTML=''
    setTimeout(()=>{
        count.children[0].remove()
        count.children[0].remove()
        let per=((100*pass)/(allQ+1)).toString(),percent
        let div=document.createElement('div')
        div.className='final-result'
        if(per[1]>=5){
           percent=+per[0]+1+'0'
        }else if(per==='100'){
            percent=per
        }
        else{
            percent=per[0]+'0'
        }

        div.classList.add(percent<=40?('red-result'):('green-result'))
        console.log(percent)
        div.innerHTML=
        `
        <h1>${evulation[percent]}</h2>
        <span class='mark'>${pass}/${allQ+1}</span>
        `
        finished=false;
        count.appendChild(div)
        skip.innerHTML='See your Answer'
        skip.classList.remove('green');
    },1000)

}
function matchSolotion(studentAnswer,correctAnswer){
    let k=0,pass=0
    for(let i=0;i<=allQ;i++){
            if(studentAnswer.some((e,ind)=>e[0]===i)){
                question.classList.remove('red')
                let a=studentAnswer[i][1];
                if(correctAnswer[i][1]===a){
                    answers.children[k+a].classList.add('green')
                    k+=numberCh
                    pass++;
                    studentAnswers.push(true)
                }else{
        
                    answers.children[k+a].classList.add('redLi')
                    k+=numberCh
                    studentAnswers.push(false)
                } 
            }else {
                console.log('you are not have answer')
                studentAnswers.push(false)
                question.classList.add('red')
                k+=numberCh
            }
    }
    return pass
}
function getResult(message){
    let count=document.createElement('div')
    count.className='count'
    count.innerHTML=message

    question.innerHTML=''
    toggleNone();
    answers.appendChild(count)
    let number=10
    count.children[1].innerHTML=number--
    console.log(count.children[1].innerHTML)
    let t=setInterval(()=>{
        count.children[1].innerHTML=number--
    },1000)
    setTimeout(()=>{
        clearInterval(t)
    },1000)
    indexes=proccesAnswers()
    solotion=getSolotion()
    let pass=matchSolotion(proccesAnswers(),getSolotion())
    showResult(count,pass)
}
skip.addEventListener('click',()=>{
    if(follow<allQ){
        follow++;
        if(follow>currentQ){
            currentQ=follow
            setQuestion(follow)
        }else{
            toggleNone('+')
        }
        skip.classList.add('filter')
        setTimeout(()=>skip.classList.remove('filter'),200)
        setpercent()
    }else if(!finished){
        if(skip.innerHTML==='Finish Test'){
                finishTime=false
                end=true
                setTimeout(()=>clearInterval(timeSet),0)
                finished=true
                getResult(normalMessge);
                
            }
        else if(skip.innerHTML==='See your Answer'){
            let mark=document.querySelector('.mark').innerHTML
                time.innerHTML=`mark ${mark}`
                seeAnswer();
                finished=true
                
        }
        else if(follow===allQ){
            skip.innerHTML='Finish Test';
            skip.classList.add('green')
            setpercent()
        }
    }
})
// document.body.addEventListener('keydown',(e)=>{
//     if(currentQ<allQ&&e.key==='ArrowRight'){
//         currentQ++;
//         setQuestion()
//         skip.classList.add('filter')
//         setTimeout(()=>skip.classList.remove('filter'),200)
//     }
// })

// document.body.addEventListener('keydown',(e)=>{
//     if((e.key==='Enter') && follow<allQ){
//         follow++;
//         if(follow<currentQ)
//             setQuestion()
//         else{

//         }
//     }
// })

back.addEventListener('click',()=>{
    if(follow>0){
        follow--;
        toggleNone('-');
        back.classList.add('filter');
        setTimeout(()=>back.classList.remove('filter'),200)
    }

})
// document.body.addEventListener('keydown',(e)=>{
//     if(currentQ>0&& e.key==='ArrowLeft'){
//         currentQ--;
//         Array.from(answers.children).forEach((ele)=>{
//             ele.classList.toggle('none')
//         })
//         back.classList.add('filter')
//         setTimeout(()=>back.classList.remove('filter'),200)
//     }
// })
answers.addEventListener('click',(e)=>{
    if(e.target.tagName==='LI'){
        let target=e.target;
        Array.from(answers.children).forEach((ele)=>{
            if(ele===target){
                ele.classList.add('click')
            }else if(!ele.classList.contains('none')){
                    ele.classList.remove('click')
            }
        })
    }
})
