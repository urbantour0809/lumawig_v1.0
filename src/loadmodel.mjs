import * as tf from '@tensorflow/tfjs'

export const loadModel = async () => {
  const model = await tf.loadLayersModel('model/model.json')
  return model
}

export default loadModel