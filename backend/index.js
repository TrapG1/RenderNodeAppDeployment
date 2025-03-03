import app from './app.js';  // Import the app setup
import { PORT } from './utils/config.js';  // Config (e.g., PORT, MONGODB_URI)
import { info } from './utils/logger.js';  // Custom logger

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});