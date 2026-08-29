FROM eclipse-temurin:25-jdk

WORKDIR /workspace

RUN useradd -m learner

RUN apt-get update \
    && apt-get install -y maven \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

USER learner

CMD ["bash"]