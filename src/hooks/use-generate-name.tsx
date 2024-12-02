"use client";

import { useCallback, useEffect, useState } from "react";

const adjectives = [
  "happy",
  "clever",
  "bright",
  "swift",
  "gentle",
  "bold",
  "calm",
  "eager",
  "fancy",
  "kind",
  "lively",
  "proud",
  "quiet",
  "wise",
  "brave",
  "cool",
  "fair",
  "quick",
  "warm",
  "young",
];

const nouns = [
  "panda",
  "tiger",
  "eagle",
  "dolphin",
  "koala",
  "fox",
  "wolf",
  "bear",
  "lion",
  "whale",
  "hawk",
  "deer",
  "seal",
  "cat",
  "owl",
  "duck",
  "fish",
  "bird",
  "swan",
  "dove",
];

export const useRandomName = (separator = "-") => {
  const [randomName, setRandomName] = useState("");

  const generateName = useCallback(() => {
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999);

    const newName = `${randomAdjective}${separator}${randomNoun}${separator}${randomNumber}`;
    setRandomName(newName);
    return newName;
  }, [separator]);

  // Generate initial name
  useEffect(() => {
    generateName();
  }, [generateName]);

  return randomName;
};
