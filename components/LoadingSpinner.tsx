import {Bars} from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const LoadingSpinner = ({color = 'white', width = 80, height = 80}) => {
  return (
    <Bars
      height={height}
      width={width}
      color={color}
      ariaLabel="bars-loading"
      wrapperStyle={{}}
      wrapperClass="py-1"
      visible={true}
    />
  );
};

export default LoadingSpinner;
