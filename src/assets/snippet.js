
export const liq = `
<h3>Our Bestsellers</h3>
<div style = "display:flex;justify-content:space-around;">
  
  {% for field in shop.metafields.inventer %}
       
       {% assign title = field | last | split: "," %}
       {% assign col = title[4] %}
    
    <div style = "display:flex;flex-direction:column;" class = "grid-item-{{col}}"> 
     
        <img src = "{{title[0]}}" width = "600" height = "400" style = "width:100%;height:200px;" />
    
         <h3 style = "font-size:15px;margin-block-end:7px;margin-block-start:7px;">{{title[3]}}</h3>
         <h3 style = "margin-block-end:0px;margin-block-start:0px;font-weight:700;text-transform:uppercase;font-size:12px">{{title[2]}}</h3>
         <h2 style = "margin-top:2px;"> £{{title[6]}}</h2>
     </div>  
       {% comment %}  {% for t in title %}
        <h1>{{t}}</h1> <p>break<p>
         {% endfor %}
        {% endcomment %}
    
       
{% endfor %}

  </div>
  {% schema %}
{
  "name": "Map",
  "max_blocks": 3,
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Heading",
      "default": "Our stores"
    },
    {
      "type": "text",
      "id": "map_link_label",
      "label": "Map link label",
      "default": "Get directions"
    },
    {
      "type": "header",
      "content": "Background"
    },
    {
      "type": "text",
      "id": "api_key",
      "label": "Google Maps API key",
      "info": "You'll need to register a [Google Maps API Key](https://help.shopify.com/manual/using-themes/troubleshooting/map-section-api-key) to display the map."
    },
    {
      "type": "range",
      "id": "zoom",
      "min": 12,
      "max": 20,
      "step": 1,
      "label": "Map zoom",
      "default": 15
    },
    {
      "type": "checkbox",
      "id": "draggable_map",
      "label": "Allow to move the map",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "show_map_controls",
      "label": "Show map controls",
      "default": false
    },
    {
      "type": "select",
      "id": "map_style",
      "label": "Map style",
      "options": [
        {
          "value": "standard",
          "label": "Standard"
        },
        {
          "value": "silver",
          "label": "Silver"
        },
        {
          "value": "retro",
          "label": "Retro"
        },
        {
          "value": "dark",
          "label": "Dark"
        },
        {
          "value": "night",
          "label": "Night"
        },
        {
          "value": "aubergine",
          "label": "Aubergine"
        }
      ],
      "default": "standard"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image",
      "info": "1200 x 600px .jpg recommended. Displayed if the map does not load."
    }
  ],
  "blocks": [
    {
      "type": "store",
      "name": "Store",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Store name",
          "default": "Store name"
        },
        {
          "type": "richtext",
          "id": "address",
          "label": "Address",
          "default": "<p>123 Fake St. Toronto, Canada</p>"
        },
        {
          "type": "richtext",
          "id": "hours",
          "label": "Hours",
          "default": "<p>Monday - Friday: 10AM - 9PM<br>Saturday: 11AM - 9PM<br>Sunday: Closed</p>"
        },
        {
          "type": "text",
          "id": "map_address",
          "label": "Map address",
          "info": "Google Maps will find the exact location",
          "default": "80 Spadina Ave, Toronto"
        }
      ]
    }
  ],
  "presets": [
    {
      "category": "Store information",
      "name": "Map",
      "settings": {},
      "blocks": [
        {
          "type": "store",
          "settings": {
            "title": "Store 1",
            "address": "<p>123 Fake St. Toronto, Canada</p>",
            "map_address": "80 Spadina Ave, Toronto"
          }
        },
        {
          "type": "store",
          "settings": {
            "title": "Store 2",
            "address": "<p>123 Fake St. Ottawa, Canada</p>",
            "map_address": "150 Elgin Street, Ottawa"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`