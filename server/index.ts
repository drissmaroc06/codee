import { createApp } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`🚀 AqwaCode Production Backend running on port ${port}`);
});
