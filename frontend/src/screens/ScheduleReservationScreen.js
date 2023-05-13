import { Container, Paper } from '@material-ui/core';
import StepForm from '../components/stepform/StepForm';
import { useLocation } from 'react-router-dom';

function ScheduleReservationScreen() {
  const location = useLocation();

  const { hotelInfo, customerInfo } = location.state;

  return (
    <Container className="my-4" component='main' maxWidth="xl">
      <Paper className="px-0 py-3 mt-4" variant='elevation' >
        <StepForm hotelInfo={hotelInfo} customerInfo={customerInfo} />
      </Paper>
    </Container>
  );
}

export default ScheduleReservationScreen;
