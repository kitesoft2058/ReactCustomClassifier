import { useEffect, useRef, useState } from "react"

const tf = require('@tensorflow/tfjs')
const mobilenetModule = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')

const Main= ()=>{

    let classifier
    let mobilenet

    useEffect(()=>{
        //training
        classifier= knnClassifier.create()

        //기존에 저장된 data set 불러와 classifier에 미리 설정해 놓기
        const datasetJson= localStorage.getItem('dataset') // json string 으로 저장되어 있음 
        console.log(datasetJson) 

        // json string --> dataset array
        const datasetFinal= JSON.parse(datasetJson)
        console.log(datasetFinal)

        // ['라벨', 이미지픽셀정보(1차원배열1024), 모양] --> ['라벨', Tensor(픽셀정보,모양)] 배열로 변환
        const datasetArray= datasetFinal.map( ([label, pixels, shape])=> [label, tf.tensor(pixels, shape)] ) //Tensor객체를 만들면서 pixel정보를 기반으로 메타데이터들 만들어줌  {kept: false, isDisposedInternal: false, shape: Array(2), dtype: 'float32', size: 1024, …}       
        console.log(datasetArray)

        // [라벨,Tensor] 배열을 dataset 객체로 변환
        const dataset = Object.fromEntries(datasetArray)
        console.log(dataset)

        // dataset을 classifier에 설정해놓기
        classifier.setClassifierDataset(dataset)

        
        mobilenetModule.load().then(model=>{
            mobilenet=model
            alert('학습 된 분류 class 개수 : ' + classifier.getNumClasses())
            console.log('학습 된 분류 class 개수 : ' + classifier.getNumClasses())
        })
    },[])

    const clickBtn= ()=>{        

        const img01 = tf.browser.fromPixels(imgRef01.current)
        const logits01 = mobilenet.infer(img01, true)
        classifier.addExample(logits01, "cat")

        const img02 = tf.browser.fromPixels(imgRef02.current)
        const logits02 = mobilenet.infer(img02, true)
        classifier.addExample(logits02, "dog")

        const img03 = tf.browser.fromPixels(imgRef03.current)
        const logits03 = mobilenet.infer(img03, true)
        classifier.addExample(logits03, "hedgehog")

        const img04 = tf.browser.fromPixels(imgRef04.current)
        const logits04 = mobilenet.infer(img04, true)
        classifier.addExample(logits04, "hedgehog")

        alert('학습완료') //학습을 여러번 할 수록 정확도가 올라감. 단, 학습 샘플이 적으면.. 잘못된 학습으로 확신을 가질 수도 있음. 즉, 지속적으로 학습시켜 능력을 업그레이드 할 수 있음

        console.log('학습 된 분류 cat class 개수 : ' + classifier.getClassExampleCount().cat)
        console.log('학습 된 분류 dog class 개수 : ' + classifier.getClassExampleCount().dog)
        console.log('학습 된 분류 hedgehog class 개수 : ' + classifier.getClassExampleCount().hedgehog)

        // 학습 데이터 저장하기 -----  학습데이터의 구조에 맞는 형태로 변환하여 저장 ---------------------------------------
        const dataset= classifier.getClassifierDataset()
        console.log(dataset)  // dataset object : { cat: Tensor object, dog: Tensor object, hedgehog: Tensor }

        // localStorage 나 server에 dataset를 저장하여 웹앱이 시작할 때 dataset을 미리 적용해 놓고자 함. 객체를 저장할 수는 없어서 JSON string 으로 변환하여 저장
        // 다만, Tensor 객체를 그대로 json string 으로 변환하여 추후 addExample 과정에서 오류 발생함. 그래서 Tendor를 배열로 변환하고 이를 JSON string으로 변환.
        const datasetArray= Object.entries( dataset ) 
        console.log(datasetArray) // dataset array : [Array(2), Array(2), Array(2)] ==> [  ['cat', Tensor], ['dog', Tensor], ['hedgehog', Tensor]  ] -- //shap : [2, 1024] -- 2차원 배열.. 한줄에 1024 [가로세로1024pixel 모델인듯] -- 

        // [label, Tensor]의 data를 [label, data, shape] 모양의 배열로 다시 변환필요.  Arrya.from() : 유사객체를 배열로 변환.  ex) Array.from('Hello") ['H','e','l' ..]
        const datasetFinal= datasetArray.map( data =>{ return [ data[0], Array.from(data[1].dataSync()) , data[1].shape ]  })  // Tensor.dataSync() : 2차원 배열을 1차원배열로 변환...이미지 픽셀정보를. 최종 1024 개의 1차원배열로 변환 [ 교재 '온디바이스 AI' p.51 참고 ]
        console.log(datasetFinal) // dataset final : [Array(3), Array(3), Array(3)] ==> [  ['cat', Array(1024), Array(2)]  ]   //shap 2차원을 1차원으로 조정..된 것을 알 수 있음.

        // 완성된 데이터셋의 구조 [ '라벨명',  이미지픽셀정보배열(1차원 1024개), 데이터의 모양([이미지개수,1024] ~ cat은 [1,1024], dog는 [1,1024], hedgehog [2,1024]) : 훈련 사진 개수 : 고양이1, 강아지1, 고슴도치:2 ]    

        // 배열을 저정할 수는 없기에 배열을 json string 으로 마지막 변환
        const datasetJson= JSON.stringify(datasetFinal)
        console.log(datasetJson)        

        // 브라우저 로컬 저장소에 저장
        localStorage.setItem( "dataset", datasetJson )        
        //=======================================================

    }

    const imgRef01= useRef()
    const imgRef02= useRef()
    const imgRef03= useRef()
    const imgRef04= useRef()
    const imgRef05= useRef()
    const imgRef06= useRef()
    const imgRef07= useRef()

   

    const clickBtn2= ()=>{
        //prediction
        const x = tf.browser.fromPixels(imgRef05.current)
        const logitsX = mobilenet.infer(x, true) //mobilenew model에 맞게 Tensor구조 변경 [ 픽셀정보 int32 --> float32 ]
        const prediction= classifier.predictClass(logitsX)
        console.log(prediction)
    }
    const clickBtn3= async ()=>{
        //prediction
        const x = tf.browser.fromPixels(imgRef06.current)
        console.log(x)
        const logitsX = mobilenet.infer(x, true) 
        // const prediction= classifier.predictClass(logitsX)
        // console.log(prediction)

        const result= await classifier.predictClass(logitsX)
        console.log(result.label, result.confidences, result.confidences[result.label]) 
    }


    const inputRef= useRef()
    const targetRef= useRef()

    const changeImage=()=>{
        const files= inputRef.current.files
        console.log(files)

        //파일리더를 사용하지 않고도 미리보기 가능함
        const url= URL.createObjectURL(inputRef.current.files[0])
        //setTargetImage(url)      // 이유는 확실치 않지만 useState로 하면 infer에서 오류 발생함
        imgRef07.current.src= url  // 이렇게 직접 src를 이용하여 지정해야 infer가 잘 됨

        //const fr= new FileReader()
        //fr.onload= ()=> setTargetImage(fr.result)
        // fr.readAsDataURL(files[0])
    }

    const [targetImage, setTargetImage] = useState()
    const clickBtn4= async ()=>{
        //prediction
        const tensor = tf.browser.fromPixels(imgRef07.current)
        console.log(tensor)
        const mobilenetTensor = mobilenet.infer(tensor, true)
        console.log(mobilenetTensor)
        const result= await classifier.predictClass(mobilenetTensor)
        console.log(result.label, result.confidences, result.confidences[result.label])
        
    }

    return (
        <div style={{padding:16,}}>

            <img src="./assets/cat.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef01}></img>
            <img src="./assets/dog.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef02}></img>
            <img src="./assets/hedgehog.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef03}></img>
            <img src="./assets/hedgehog2.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef04}></img>

            <button onClick={clickBtn}>learning</button>
            <hr></hr>

            <img src="./assets/hedgehog3.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef05}></img>
            <button onClick={clickBtn2}>classify</button>
            <img src="./assets/cat.jpg" alt="cat" style={{width:150, margin:4}} ref={imgRef06}></img>
            <button onClick={clickBtn3}>classify</button>

            <hr></hr>
            <input type="file" ref={inputRef} onChange={changeImage}></input>
            <br></br>
            <img src={targetImage} height={256} ref={imgRef07}></img>
            <button onClick={clickBtn4}>classifier</button>

            
        </div>
    )

}
export default Main