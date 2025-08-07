package publicaciones.aspect;

import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class TracingAspect {

    private final Tracer tracer;

    @Around("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public Object traceControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        Span span = tracer.spanBuilder(className + "." + methodName)
                .setAttribute("component", "controller")
                .setAttribute("method", methodName)
                .setAttribute("class", className)
                .startSpan();
        
        try (var scope = span.makeCurrent()) {
            Object result = joinPoint.proceed();
            span.setAttribute("success", true);
            return result;
        } catch (Exception e) {
            span.setAttribute("success", false);
            span.setAttribute("error", e.getMessage());
            span.recordException(e);
            throw e;
        } finally {
            span.end();
        }
    }

    @Around("execution(* publicaciones.service.*.*(..))")
    public Object traceServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        Span span = tracer.spanBuilder(className + "." + methodName)
                .setAttribute("component", "service")
                .setAttribute("method", methodName)
                .setAttribute("class", className)
                .startSpan();
        
        try (var scope = span.makeCurrent()) {
            Object result = joinPoint.proceed();
            span.setAttribute("success", true);
            return result;
        } catch (Exception e) {
            span.setAttribute("success", false);
            span.setAttribute("error", e.getMessage());
            span.recordException(e);
            throw e;
        } finally {
            span.end();
        }
    }

    @Around("execution(* publicaciones.repository.*.*(..))")
    public Object traceRepositoryMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        
        Span span = tracer.spanBuilder(className + "." + methodName)
                .setAttribute("component", "repository")
                .setAttribute("method", methodName)
                .setAttribute("class", className)
                .startSpan();
        
        try (var scope = span.makeCurrent()) {
            Object result = joinPoint.proceed();
            span.setAttribute("success", true);
            return result;
        } catch (Exception e) {
            span.setAttribute("success", false);
            span.setAttribute("error", e.getMessage());
            span.recordException(e);
            throw e;
        } finally {
            span.end();
        }
    }
}
