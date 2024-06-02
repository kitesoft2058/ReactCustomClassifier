import { useEffect, useState, useRef } from 'react'

// import * as tf from '@tensorflow/tfjs'
// import * as mobilenetModule from '@tensorflow-models/mobilenet'
// import * as knnClassifier from '@tensorflow-models/knn-classifier'
const tf = require('@tensorflow/tfjs')
const mobilenetModule = require('@tensorflow-models/mobilenet')
const knnClassifier = require('@tensorflow-models/knn-classifier')

const App= ()=>{

  let classifier=undefined
  let mobilenet=undefined

  const [loadedModel, setLoadedModel] = useState(false) 

  useEffect(()=>{ // useEffect에서 asynce동작 불가.. 오래걸리는 작업으로 인한 문제..
    // Create the classifier.
    classifier= knnClassifier.create()

    // mobilenet load model
    mobilenetModule.load().then((model)=>{
      mobilenet= model
      setLoadedModel(true)
    })
  },[])

  //------ trainning image----------------------------------------
  const imgRef01= useRef()
  const inputRef= useRef()
  const inputRef2= useRef()
  const changeImage= ()=>{
    const files= inputRef.current.files
    const url= URL.createObjectURL(files[0])
    //imgRef.current.src= url
  }
  const clickBtn= ()=>{
    // const tensor= tf.browser.fromPixels(imgRef.current)
    // const mobilenetTensor= mobilenet.infer(tensor, true)
    // classifier.addExample(mobilenetTensor, 'cat')
    const img01 = tf.browser.fromPixels(imgRef01.current)
        const logits01 = mobilenet.infer(img01, true)
        classifier.addExample(logits01, "cat")
  }
  //--------------------------------------------------------------

  //------ target image----------------------------------------
  const imgRef2= useRef()
  const inputRef3= useRef()
  const changeImage2= ()=>{
    const files= inputRef3.current.files
    const url= URL.createObjectURL(files[0])
    imgRef2.current.src= url
  }
  const clickBtn2= ()=>{
    const tensor= tf.browser.fromPixels(imgRef2.current)
    const mobilenetTensor= mobilenet.infer(tensor, true)
    const result= classifier.predictClass(mobilenetTensor)
    console.log(result)
    
  }
  //--------------------------------------------------------------

  return (
    <div style={{padding:16,}}>
      
      <img style={{height:230, width:230, border:'solid'}} ref={imgRef01} src='./assets/cat.jpg'></img>
      
      {
        loadedModel ?
        (
          <div>

            <h4>training image</h4>
            <input type='file' ref={inputRef} onChange={changeImage}></input>
            <br></br>
            {/* <img style={{height:230, width:230, border:'solid'}} ref={imgRef} src='./assets/cat.jpg'></img> */}
            <br></br>
            <input placeholder='분류명' ref={inputRef2} style={{padding:8}}></input>
            <button style={{padding:8, marginLeft:4}} onClick={clickBtn}>Learning</button>

            <hr></hr>

            <h4>target image</h4>
            <input type='file' ref={inputRef3} onChange={changeImage2}></input>
            <br></br>
            <img style={{height:230, width:230, border:'solid'}} ref={imgRef2}></img>
            <br></br>
            <button style={{padding:8, marginLeft:4}} onClick={clickBtn2}>Image Classification</button>



          </div>
        )
        :
        (
          <h2>mobile net loading.....</h2>
        )

      }      
    </div>
  )
}
export default App