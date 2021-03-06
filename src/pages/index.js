import {useEffect} from 'react';
import Head from 'next/head';
import HomePage from '../components/templates/HomePage';
import DefaultLayout from '../components/layouts/DefaultLayout';
import {db} from '../../firebase';

export default function Home({breeds, topBreedsData}) {
  useEffect(() => {
    console.log(topBreedsData);
  }, []);
  return (
    <DefaultLayout>
      <Head>
        <title>Cat Wiki</title>
      </Head>
      <HomePage breeds={breeds} topBreedsData={topBreedsData} />
    </DefaultLayout>
  );
}

export async function getStaticProps() {
  const url = 'https://api.thecatapi.com/v1/breeds/';
  const breeds = await fetch(url).then(res => res.json());

  const topBreeds = await db.limit(10).orderBy('count', 'desc').get();
  const topBreedsData = topBreeds.docs.map(doc => {
    let breed = breeds.find(e => e.id == doc.id);
    return {
      id: doc.id,
      count: doc.data().count,
      name: breed.name,
      description: breed.description,
      image: breed.image.url,
    };
  });

  return {
    props: {
      breeds,
      topBreedsData,
    },
  };
}
