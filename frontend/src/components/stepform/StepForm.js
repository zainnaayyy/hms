import Box from '@material-ui/core/Box';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import Confirm from './Confirm';
import Success from './Success';
import { useEffect, useState } from 'react';

const StepForm = ({ hotelInfo, customerInfo }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');

  // Step titles
  const labels = ['When are you available for reservation ?', `Choose your preferred room type at ${hotelInfo.hotelName}`, 'Confirmation'];

  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return <FirstStep activeStep={activeStep} setActiveStep={setActiveStep} setStartDate={setStartDate} startDate={startDate} setEndDate={setEndDate} hotelID={hotelInfo._id} customerID={customerInfo._id} />;
      case 1:
        return <SecondStep activeStep={activeStep} setActiveStep={setActiveStep} setVenue={setVenue} venue={venue} />;
      case 2:
        return <Confirm activeStep={activeStep} setActiveStep={setActiveStep} startDate={startDate} endDate={endDate} setVenue={setVenue} venue={venue} hotelID={hotelInfo._id} customerID={customerInfo._id} />;
      default:
        throw new Error('Unknown step');
    }
  };


  return (
    <>
      {activeStep === labels.length ? (
        <Success customerName={customerInfo.firstName} hotelName={hotelInfo.hotelName} venue={venue} startDate={startDate} />
      ) : (
        <>
          <Box my={5}>
            <Typography className="text-secondary" variant='h4' align='center'>
              Reservation Scheduler
            </Typography>
            <Typography variant='subtitle1' align='center' className="mt-2 text-info">
              Hi {customerInfo.firstName}! Let's schedule your reservation with <span className="text-capitalize">{hotelInfo.hotelName}</span>
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} className="py-3" alternativeLabel>
            {labels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {handleSteps(activeStep)}
        </>
      )}
    </>
  );
};

export default StepForm;
