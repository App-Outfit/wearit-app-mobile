{{ fullname }}
{{ underline }}

.. automodule:: {{ fullname }}
    :members:
    :undoc-members:
    :show-inheritance:

{% block classes %}
{% if classes %}
.. rubric:: Classes

{% for class in classes %}
- :class:`{{ class }}`
{% endfor %}
{% endif %}
{% endblock %}

{% block functions %}
{% if functions %}
.. rubric:: Functions

{% for function in functions %}
- :func:`{{ function }}`
{% endfor %}
{% endif %}
{% endblock %}

{% block exceptions %}
{% if exceptions %}
.. rubric:: Exceptions

{% for exception in exceptions %}
- :exc:`{{ exception }}`
{% endfor %}
{% endif %}
{% endblock %}

{% block attributes %}
{% if attributes %}
.. rubric:: Attributes

{% for attribute in attributes %}
- :attr:`{{ attribute }}`
{% endfor %}
{% endif %}
{% endblock %}