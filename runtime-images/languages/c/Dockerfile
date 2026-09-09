FROM gcc:15-bookworm

WORKDIR /workspace

RUN useradd \
    --create-home \
    --shell /bin/bash \
    learner

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

COPY scripts/run-c.sh /usr/local/bin/run-c

RUN chmod 755 /usr/local/bin/run-c

USER learner

CMD ["bash"]