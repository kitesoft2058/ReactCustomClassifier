import { useRef, useState } from 'react'
// Tensorflow JS : 제공하는 자바스크립트 머신러닝 라이브러리
// [사이트의 '튜토리얼'을 학습할 내용이 다소 많아. 곧바로 사용가능한 '모델보기'를 통해 마치 ML kit의 턴키솔루션 같은  ML기능 사용하기]

// 여러 모델이 있지만 시간상. [이미지 분류],[객체 감지],[악성 텍스트 감지]에 대한 실습 진행
const tf= require('@tensorflow/tfjs')
const mobilenet = require('@tensorflow-models/mobilenet')

const Main= ()=>{

    // 실습1)에서 사용할 img요소 참조변수 useRef() HOOK 을 이용한 요소제어
    const imgRef= useRef()
    const clickBtn= async ()=>{
        //[1] Load the model.[비동기 다운로드 ~ .then() promiss 방식]
        //mobilenet.load().then(model=>alert('model loaded'))

        //[2] Load the model.[비동기 다운로드 ~ 편의문법인 async- await으로 동기식 코드로 작성]
        const model = await mobilenet.load()

        //[3] 로딩한 머신러닝 model을 통해 imgRef가 참조하는 img요소의 그림을 분석하여 1000여개의 label 중 가능성이 놓은 라벨명과 확률을 결과로 줌
        const result = await model.classify(imgRef.current) //HTML 요소를 파라미터로 전달

        alert('분석완료')
        //[4] 분석결과를 콘솔로 보기(브라우저의 F12 개발자모드를 통해 객체에 대한 세부내역도 파악하기 용이하여 개발할때 애용됨 )
        console.log(result) //출력 : Array(3) ~ 배열로 결과를 줌 [{},{},{}] --- {className: 'Pomeranian', probability: 0.9054722189903259}

        //[5] 보통 첫번째 데이터가 가장 확률이 높기에. 이를 UI로 표시하기 -- useState()로 data 변수만들고 button아래 p요소에 사용
        setData(result[0].className +" - 가능성 : " + result[0].probability)

                
    }
    //분석결과를 저장한 변수
    const [data, setData]= useState('no data')

    return (
        <div style={{padding:16,}}>

            {/* (실습1) 이미지 분류 - ImageNet 데이터베이스의 라벨로 이미지를 분류(MobileNet 모델 사용--1000여개의 라벨분류) */}
            {/* 1.1) 필요한 라이브러리 설치 : npm install or yarn add  [ @tensorflow/tfjs, @tensorflow-models/mobilenet] */}
            {/* 1.2) Main.js에서 사용하기 위해 import하기. 단, require()함수로 객체 import.   */}

            {/* 분류할 대상 이미지를 보여주는 요소 [이미지의 경로는 public의 이미지를 대상으로 지정. 물론. 서버의 이미지도 가능함]*/}
            <img src='./assets/dog.jpg' style={{height:150}} ref={imgRef}></img>
            <button onClick={clickBtn}>image classification</button>
            <p>분석결과 : {data}</p>

            <hr></hr>
            {/* (실습2) 객체 감지 - 단일 이미지에서 여러 객체를 식별 (Coco SSD)*/}



        </div>
    )
}
export default Main