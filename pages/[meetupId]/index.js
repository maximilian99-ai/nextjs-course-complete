import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from 'next/head';
import { Fragment } from 'react';

function MeetupDetails(props) {
  return(
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title} 
        address={props.meetupData.address} 
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

export async function getStaticPaths() { // 경로 배열을 동적으로 생성
  const client = await MongoClient.connect('mongodb+srv://maximilian:0542asdf@cluster0.g8xvkqd.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const meetups = meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  
  return {
    fallback: 'blocking',
    paths: meetups.map(meetup => ({
      params: { meetupId: meetup._id.toString() }
    }))
  };
}

export async function getStaticProps(context) { // 동적 페이지의 인스턴스가 사전 렌더링돼야 함을 Next.js에 알림
  // 단일 meetup을 위해 데이터를 페치하기
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://<username:password>@cluster0.g8xvkqd.mongodb.net/meetups?retryWrites=true&w=majority');
  const db = client.db();

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId)
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  };
}

export default MeetupDetails;