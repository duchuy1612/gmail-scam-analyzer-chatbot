#!/usr/bin/env python3
"""Training script for the phishing classifier."""

import argparse
from pathlib import Path
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib


def main(args):
    try:
        data = pd.read_csv(args.data_path)
    except (IOError, PermissionError) as e:
        print(f"Error reading CSV file: {e}")
        return

    if not {'text', 'label'}.issubset(data.columns):
        raise ValueError("Dataset must contain 'text' and 'label' columns")

    X_train, X_test, y_train, y_test = train_test_split(
        data['text'], data['label'], test_size=0.2, random_state=42
    )

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])

    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    print(classification_report(y_test, preds))

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        joblib.dump(pipeline, output_path)
        print(f"Model saved to {output_path}")
    except (IOError, PermissionError) as e:
        print(f"Error saving model: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train phishing detection model")
    parser.add_argument(
        "--data-path",
        default="phishing_dataset.csv",
        help="CSV file with columns 'text' and 'label' (1=phishing, 0=legit)"
    )
    parser.add_argument(
    if not {'text', 'label'}.issubset(data.columns):
        raise ValueError("Dataset must contain 'text' and 'label' columns")

    X_train, X_test, y_train, y_test = train_test_split(
        data['text'], data['label'], test_size=0.2, random_state=42
    )

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import joblib
from sklearn.model_selection import GridSearchCV  # import GridSearchCV for hyperparameter tuning


def main(args):
    data = pd.read_csv(args.data_path)
    if not {'text', 'label'}.issubset(data.columns):
        raise ValueError("Dataset must contain 'text' and 'label' columns")

    X_train, X_test, y_train, y_test = train_test_split(
        data['text'], data['label'], test_size=0.2, random_state=42
    )

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression())
    ])

    param_grid = {
        'tfidf__max_features': [1000, 5000, 10000],
        'tfidf__stop_words': [None, 'english'],
        'clf__C': [0.1, 1, 10],
        'clf__max_iter': [1000, 2000, 3000]
    }

    grid_search = GridSearchCV(pipeline, param_grid, cv=5, n_jobs=-1)
    grid_search.fit(X_train, y_train)

    best_pipeline = grid_search.best_estimator_
    preds = best_pipeline.predict(X_test)
    print(classification_report(y_test, preds))
    print(f"Best parameters: {grid_search.best_params_}")

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(best_pipeline, output_path)
    print(f"Model saved to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train phishing detection model")
    parser.add_argument(
        "--data-path",
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])

    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
import joblib
import logging  # Import logging module for proper logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main(args):
    data = pd.read_csv(args.data_path)
    if not {'text', 'label'}.issubset(data.columns):
        raise ValueError("Dataset must contain 'text' and 'label' columns")

    X_train, X_test, y_train, y_test = train_test_split(
        data['text'], data['label'], test_size=0.2, random_state=42
    )

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])

    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)
    logging.info(f"Classification Report:
{classification_report(y_test, preds)}")

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output_path)
    logging.info(f"Model saved to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train phishing detection model")
    parser.add_argument(
        "--data-path",
        default="phishing_dataset.csv",
        help="CSV file with columns 'text' and 'label' (1=phishing, 0=legit)"
    )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, output_path)
    print(f"Model saved to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train phishing detection model")
    parser.add_argument(
        "--data-path",
        default="phishing_dataset.csv",
        help="CSV file with columns 'text' and 'label' (1=phishing, 0=legit)"
    )
    parser.add_argument(
        "--output", default=str(Path('app') / 'model.joblib'), help="Output model file"
    )
    args = parser.parse_args()
    main(args)
