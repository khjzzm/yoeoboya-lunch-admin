import { useEffect, useState } from "react";

interface KorWordsDataset {
  adjective: string[];
  noun: string[];
}

export function useRandomKoreanName() {
  const [randomName, setRandomName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    fetch("https://cdn.jsdelivr.net/gh/squarehacker/kor4randomwords/resource/dataset.json")
      .then((response) => response.json())
      .then((data: KorWordsDataset) => {
        if (cancelled) return;

        const adj = data.adjective[Math.floor(Math.random() * data.adjective.length)];
        const noun = data.noun[Math.floor(Math.random() * data.noun.length)];
        setRandomName(adj + noun);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  return randomName;
}
