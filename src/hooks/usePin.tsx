import React, { useState } from 'react'

const createPromise = () => {
    let resolver;
    return [ new Promise(( resolve, reject ) => {
        resolver = resolve
    }), resolver]
}

export const usePin = () => {
  const [ resolver, setResolver ] = useState({ resolve: null })

  const getPin = async () => {
        const [ promise, resolve ] = await createPromise()
        setResolver({ resolve })
        return promise;
  }

  const onConfirm = async(pin) => {
        resolver.resolve(pin);
  }

    return [ getPin, onConfirm ]
}