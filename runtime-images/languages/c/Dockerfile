FROM gcc:latest

WORKDIR /workspace

RUN useradd -m learner

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

USER learner

CMD ["bash"]