import video from '../assets/videos/hero.mp4';

const BgVideo = ({ title }) => {
  return (
    <div className="bg-video">
      <video className="bg-video__content" autoPlay muted loop>
        <source src={video} type="video/mp4" />
        <source src={video} type="video/webm" />
      </video>
    </div>
  );
};

export default BgVideo;