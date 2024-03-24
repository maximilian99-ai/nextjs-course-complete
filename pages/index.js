import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';
import Head from 'next/head';
import { Fragment } from 'react';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
         name='description'
         content='Browse a huge list of hightly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // 어떤 API로부터 데이터를 페치하기 
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   };
// }

export async function getStaticProps() {
  // 어떤 API로부터 데이터를 페치하기
  const client = await MongoClient.connect('mongodb+srv://<username:password>@cluster0.g8xvkqd.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 1
  };
}

export default HomePage;