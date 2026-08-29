FROM python:3.13-slim

WORKDIR /workspace

RUN useradd -m learner

RUN pip install --no-cache-dir pytest

RUN mkdir -p /workspace \
    && chown -R learner:learner /workspace

USER learner

CMD ["python"]