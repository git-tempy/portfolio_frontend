export default function SubsectionTitle({index,label,title}) {
 return <div className="subsection-heading"><span className="eyebrow">{index} / {label}</span>{title&&<h3 className="subheading">{title}</h3>}</div>;
}
