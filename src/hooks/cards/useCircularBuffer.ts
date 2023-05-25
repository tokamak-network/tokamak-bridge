import { useState } from 'react';

interface CircularBuffer<T> {
  write: (value: T) => void;
  read: () => T | undefined;
  clear: () => void;
  isFull: () => boolean;
  isEmpty: () => boolean;
  getSize: () => number;
  getCount: () => number;
}

function useCircularBuffer<T>(size: number): CircularBuffer<T> {
  const [buffer, setBuffer] = useState<Array<T | null>>(new Array<T | null>(size).fill(null));
  const [writeIndex, setWriteIndex] = useState<number>(0);
  const [readIndex, setReadIndex] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const write = (value: T) => {
    setBuffer((prevBuffer) => {
      if (prevBuffer.length === size) {
        prevBuffer[readIndex] = null;
        setReadIndex((prevReadIndex) => (prevReadIndex + 1) % size);
        setCount((prevCount) => Math.max(prevCount - 1, 0));
      }
      prevBuffer[writeIndex] = value;
      setWriteIndex((prevWriteIndex) => (prevWriteIndex + 1) % size);
      setCount((prevCount) => Math.min(prevCount + 1, size));
      return [...prevBuffer];
    });
  };

  const read = (): T | undefined => {
    if (count === 0) {
      return undefined;
    }

    const value = buffer[readIndex];

    setReadIndex((prevReadIndex) => (prevReadIndex + 1) % size);
    setCount((prevCount) => prevCount - 1);

    return value !== null ? (value as T) : undefined;
  };

  const clear = () => {
    setBuffer(new Array<T | null>(size).fill(null));
    setWriteIndex(0);
    setReadIndex(0);
    setCount(0);
  };

  const isFull = (): boolean => {
    return count === size;
  };

  const isEmpty = (): boolean => {
    return count === 0;
  };

  const getSize = (): number => {
    return size;
  };

  const getCount = (): number => {
    return count;
  };

  const iterator = {
    [Symbol.iterator]: () => {
      let index = readIndex;
      let remaining = count;
      return {
        next: () => {
          if (remaining > 0) {
            const value = buffer[index];
            index = (index + 1) % size;
            remaining--;
            return { value, done: false };
          } else {
            return { value: undefined as any, done: true };
          }
        },
      };
    },
  };

  const circularBuffer: CircularBuffer<T> = {
    write,
    read,
    clear,
    isFull,
    isEmpty,
    getSize,
    getCount,
    ...iterator,
  };

  return circularBuffer;
}

export default useCircularBuffer;
