export default function SubsectionTitle({index,title}) {
 return <div className="subsection-heading"><span className="eyebrow">{index} / {title}</span><h3 className="subheading">{title}</h3></div>;
}
