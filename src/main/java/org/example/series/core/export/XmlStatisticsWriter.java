package org.example.series.core.export;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.example.series.core.model.Series;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.nio.file.Path;
import java.util.Map;

/**
 * Utility class responsible for exporting aggregated statistics
 * into an XML file.
 *
 * The generated XML structure has the following format:
 *
 * <statistics by="attribute">
 *     <item>
 *         <value>...</value>
 *         <count>...</count>
 *     </item>
 *     ...
 * </statistics>
 *
 * This class contains only static methods and is not intended
 * to be instantiated.
 */
/**
 * Writes statistics to XML file.
 */
public class XmlStatisticsWriter {

    /**
     * Writes statistics data to an XML file.
     *
     * @param stats      map containing attribute value -> count
     * @param attribute  attribute name used for grouping (e.g. genre, year)
     * @param outputFile path to the output XML file
     */
    public static void write(Map<String, Long> stats,
                             String attribute,
                             Path outputFile) {

        try {
            Document doc = DocumentBuilderFactory.newInstance()
                    .newDocumentBuilder()
                    .newDocument();

            Element root = doc.createElement("statistics");
            root.setAttribute("by", attribute);
            doc.appendChild(root);

            for (Map.Entry<String, Long> entry : stats.entrySet()) {

                Element item = doc.createElement("item");

                Element value = doc.createElement("value");
                value.setTextContent(entry.getKey());

                Element count = doc.createElement("count");
                count.setTextContent(String.valueOf(entry.getValue()));

                item.appendChild(value);
                item.appendChild(count);

                root.appendChild(item);
            }

            Transformer transformer =
                    TransformerFactory.newInstance().newTransformer();

            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(
                    "{http://xml.apache.org/xslt}indent-amount",
                    "2"
            );

            transformer.transform(
                    new DOMSource(doc),
                    new StreamResult(outputFile.toFile())
            );

        } catch (Exception ex) {
            throw new RuntimeException(
                    "Failed to write XML: " + outputFile,
                    ex
            );
        }
    }
}
