FROM node:24-bookworm-slim

WORKDIR /workspace

RUN npm install -g pnpm typescript tsx

RUN useradd -m learner

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

USER learner

CMD ["bash"]