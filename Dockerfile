FROM mcr.microsoft.com/playwright

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        wget \
        curl \
        unzip \
        nginx \
        ffmpeg \
        python3 \
        dos2unix \
        apt-utils \
        opus-tools \
        python3-pip \
        python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Set working directory
WORKDIR .

# Install Node.js dependencies
RUN npm install --global --force \
    yarn \
    yt-dlx

# Install project dependencies
RUN yarn run remake

# Set default command
CMD ["yarn", "run", "ingress"]
