import { useEffect, useState } from 'react';


interface IndexResponse {
  message: string;
}

const Home = () => {
  const [data, setData] = useState<IndexResponse | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/index', {
      credentials: 'include', // For JWT cookies
    })
      .then((res) => res.json())
      .then((data: IndexResponse) => setData(data));
  }, []);

  return <div>{data ? data.message : "Loading..."}</div>;
};

export default Home;
