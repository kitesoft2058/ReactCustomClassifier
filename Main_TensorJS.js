import { useRef, useState } from 'react'
import bbb from './image/bbb.jpg'

const tf = require('@tensorflow/tfjs')
const mobilenet= require('@tensorflow-models/mobilenet')

// 악성 텍스트 감지 [ 독성도 toxicity ]
const toxicity = require('@tensorflow-models/toxicity')

// object detection
const cocoSsd = require('@tensorflow-models/coco-ssd')


const Main= ()=>{

    const clickBtn= ()=>{
        mobilenet.load().then(model=>{
            // classify()에 전달 가능함 파라미터 : img요소, video요소, canvas요소, image data[ cavas요소 안에서  var imageData = ctx.getImageData(x, y, width, height) ]
            
            //model.classify(imgRef.current).then(predictions=>alert( predictions.length )) //[1] image classifiy 동작여부 확인 

            //model.classify(imgRef.current).then(predictions=> console.log(predictions) )  //[2] image classifiy 동작결과 객체 predictions 배열 객체 정보 확인
            
            model.classify(imgRef.current).then(predictions=> setResults(predictions) )  //[3] useState HOOK으로 이미지분류 정보 화면에 표시하기
        })        
    }

    const [results, setResults]= useState([])
    const imgRef= useRef()


    //악성 텍스트 감지...
    const inputRef= useRef()
    const clickBtn2= ()=>{

        toxicity.load(0.9).then(model=>{
            
            //현재는 영어만 가능함 - 해결방법. 안드로이드의 ML kit [ implementation 'com.google.mlkit:translate:17.0.2' ]를 통해 번역된 영어를 얻어와서 검사. [Hybrid 연습]
            const sentence= inputRef.current.value
            const sentences= [ sentence, 'you suck']

            // 7가지 악성글 종류에 해당하는지 match 여부 확인 가능
            model.classify(sentences).then(predictions=>console.log(predictions))

            //0: {label: 'identity_attack', results: Array(2)}    - 정체성 공격
            //1: {label: 'insult', results: Array(2)}             - 모욕          [인설트]
            //2: {label: 'obscene', results: Array(2)}            - 외설, 음탕한  [아브신]    
            //3: {label: 'severe_toxicity', results: Array(2)}    - 심한 독성     [서비어 톡시서티] 
            //4: {label: 'sexual_explicit', results: Array(2)}    - 성적 표현     
            //5: {label: 'threat', results: Array(2)}             - 위협          [쓰렛] 
            //6: {label: 'toxicity', results: Array(2)}           - 독성             
            
             /*
            prints:
            {
            "label": "identity_attack",
            "results": [{
                "probabilities": [0.9659664034843445, 0.03403361141681671],
                "match": false
            }]
            },
            {
            "label": "insult",
            "results": [{
                "probabilities": [0.08124706149101257, 0.9187529683113098],
                "match": true
            }]
            },
            ...
            */
        }) 
    }


    const imgRef2= useRef()
    const clickBtn3= ()=>{
        cocoSsd.load().then(model=>{
            model.detect(imgRef2.current).then(predictions=>console.log(predictions))
        })
    }


    return (
        <div style={{padding:16}}>
            <img src='./assets/aaa.jpg' ref={imgRef}></img>
            {/* <img src='./assets/img04.jpg' ref={imgRef}></img> */}
            <hr></hr>
            <button onClick={clickBtn}>classify</button>
            <hr></hr>
            {
                results.map((prediction, index)=>{
                    return <p key={index}>{prediction.className} : {prediction.probability} </p>
                })
            }

            <hr></hr>
            <input placeholder='some text....' ref={inputRef}></input>
            <button onClick={clickBtn2}>악성 댓글 감지</button>

            <hr></hr>
            {/* <img src='./assets/food1.jpg' ref={imgRef2}></img> */}
            {/* <img src='./assets/bunsic2.jpg' ref={imgRef2}></img> */}
            <img src='./assets/desk.jpg' ref={imgRef2} style={{maxWidth:'80%'}}></img>
            <button onClick={clickBtn3}>object detection</button>
            
        </div>
    )
}
export default Main