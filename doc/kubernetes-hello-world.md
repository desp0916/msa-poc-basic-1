
``` bash
2019-11-25T07:33:41.760484918Z io.fabric8.kubernetes.client.KubernetesClientException: Failure executing: GET at: https://10.96.0.1/api/v1/namespaces/default/services. Message: Forbidden!Configured service account doesn't have access. Service account may have been revoked. services is forbidden: User "system:serviceaccount:default:default" cannot list resource "services" in API group "" in the namespace "default".
```

``` bash
kubectl edit role default 加上 services

```