import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Math and CS",
    Svg: require("@site/static/img/wizard.png").default,
    description: <>Independent researcher in the alignment community.</>,
  },
  {
    title: "Transhumanist",
    Svg: require("@site/static/img/space.png").default,
    description: (
      <>
        Sentience really does matter, and we can make outcomes good rather than
        bad.
      </>
    ),
  },
  {
    title: "It is time for some game theory",
    Svg: require("@site/static/img/gametheory.png").default,
    description: (
      <>
        I would like stakeholders and ML systems to be able to bargain, trade,
        compete, and cooperate without catastrophic side effects.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
